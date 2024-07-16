"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const auth_constants_1 = require("../auth/constants/auth.constants");
const client_1 = require("@prisma/client");
const twilio_service_1 = require("../services/twilio.service");
const date_fns_1 = require("date-fns");
let UsersService = class UsersService {
    constructor(prisma, twilio) {
        this.prisma = prisma;
        this.twilio = twilio;
    }
    async getTaskCountsByStatusForEmployees() {
        const employees = await this.prisma.user.findMany({
            include: {
                TaskAssignment: {
                    include: {
                        task: true,
                    },
                },
            },
            where: {
                TaskAssignment: {
                    some: {
                        task: {
                            date: {
                                gte: (0, date_fns_1.startOfWeek)(new Date(), { weekStartsOn: 1 }),
                            },
                        },
                    },
                },
            },
        });
        return employees.map((employee) => ({
            employeeId: employee.id,
            name: employee.name || 'No Name Provided',
            taskCounts: employee.TaskAssignment.reduce((acc, assignment) => {
                const status = assignment.task.status || 'Undefined';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {}),
        }));
    }
    async create(createUserDto) {
        createUserDto.password = await bcrypt.hash(createUserDto.password, auth_constants_1.ROUNDS_OF_HASHING);
        return this.prisma.user.create({
            data: createUserDto,
        });
    }
    async deleteUser(id) {
        return this.prisma.user.delete({ where: { id } });
    }
    async generateInviteCode(inviteUserDto) {
        const { id } = await this.prisma.user.create({
            data: inviteUserDto.email
                ? {
                    name: inviteUserDto.name,
                    email: inviteUserDto.email,
                    role: inviteUserDto.role,
                    password: 'mockPass',
                }
                : {
                    name: inviteUserDto.name,
                    phoneNumber: inviteUserDto.phoneNumber,
                    role: inviteUserDto.role,
                    password: 'mockPass',
                },
        });
        if (inviteUserDto.phoneNumber)
            await this.twilio.sendInviteCodeSMS(inviteUserDto.phoneNumber, id);
        else {
        }
    }
    async updateUser(id, updateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }
    userExists(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    findAllUserByRole(role) {
        const roleEnumValue = client_1.Role[role.toUpperCase()];
        if (!roleEnumValue)
            throw new Error(`Invalid role: ${role.toUpperCase()}`);
        return this.prisma.user.findMany({ where: { role: roleEnumValue } });
    }
    findUser(id) {
        return this.prisma.user.findUnique({ where: { id: id } });
    }
    async findAllUsers({ page, limit, offset, size }, sort, search) {
        const response = await this.prisma.user.findMany({
            skip: offset,
            take: limit,
            orderBy: [
                {
                    [sort?.property || 'id']: sort?.direction || 'asc',
                },
            ],
            where: search.field && search.searchParam
                ? {
                    [search.field]: {
                        contains: search.searchParam,
                        mode: 'insensitive',
                    },
                }
                : {},
        });
        return {
            data: response,
            dataSize: response.length,
            page,
            size,
        };
    }
    async findAllClients({ page, limit, offset, size }, sort, search) {
        const response = await this.prisma.user.findMany({
            skip: offset,
            take: limit,
            orderBy: [
                {
                    [sort?.property || 'id']: sort?.direction || 'asc',
                },
            ],
            where: search.field && search.searchParam
                ? {
                    role: client_1.Role.CLIENT,
                    [search.field]: {
                        contains: search.searchParam,
                        mode: 'insensitive',
                    },
                }
                : { role: client_1.Role.CLIENT },
        });
        return {
            data: response,
            dataSize: response.length,
            page,
            size,
        };
    }
    async getTopUsersByCompletedTasks() {
        const users = await this.prisma.user.findMany({
            include: {
                TaskAssignment: {
                    include: {
                        task: {
                            select: {
                                status: true,
                            },
                        },
                    },
                },
            },
        });
        const processedUsers = users.map((user) => ({
            ...user,
            completedTaskCount: user.TaskAssignment.reduce((acc, assignment) => {
                return acc + (assignment.task.status === 'COMPLETED' ? 1 : 0);
            }, 0),
        }));
        processedUsers.sort((a, b) => b.completedTaskCount - a.completedTaskCount);
        return processedUsers.slice(0, 10);
    }
    async findAllEmployees({ page, limit, offset, size }, sort, search) {
        const response = await this.prisma.user.findMany({
            skip: offset,
            take: limit,
            orderBy: [
                {
                    [sort?.property || 'id']: sort?.direction || 'asc',
                },
            ],
            where: search.field && search.searchParam
                ? {
                    role: client_1.Role.EMPLOYEE,
                    [search.field]: {
                        contains: search.searchParam,
                        mode: 'insensitive',
                    },
                }
                : { role: client_1.Role.EMPLOYEE },
            include: {
                _count: {
                    select: {
                        TaskAssignment: true,
                    },
                },
            },
        });
        return {
            data: response,
            dataSize: response.length,
            page,
            size,
        };
    }
    async deleteMultiple(deleteMultipleUsersDto) {
        return this.prisma.user.deleteMany({
            where: {
                id: {
                    in: deleteMultipleUsersDto.users,
                },
            },
        });
    }
    async createUser(createUser) {
        const info = await this.prisma.inviteCodes.findUnique({
            where: { id: createUser.inviteCode },
        });
        return this.prisma.user.create({
            data: {
                name: createUser.name,
                email: createUser.email,
                password: createUser.password,
                role: info.role,
            },
        });
    }
    async getEmployeeDetails(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                TaskAssignment: {
                    include: {
                        task: {
                            select: {
                                id: true,
                                _count: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async employeeLogin(payload) {
        const { token } = payload;
        console.log(token);
        const response = await this.prisma.user.findUnique({
            where: { id: token },
        });
        return response;
    }
    getUserChat(userId) {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        twilio_service_1.TwilioService])
], UsersService);
//# sourceMappingURL=users.service.js.map
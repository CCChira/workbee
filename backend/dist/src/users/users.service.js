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
let UsersService = class UsersService {
    constructor(prisma, twilio) {
        this.prisma = prisma;
        this.twilio = twilio;
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
        const { id } = await this.prisma.inviteCodes.create({
            data: inviteUserDto.email
                ? { email: inviteUserDto.email, role: inviteUserDto.role }
                : { phoneNumber: inviteUserDto.phoneNumber, role: inviteUserDto.role },
        });
        console.log(inviteUserDto.phoneNumber, id);
        if (inviteUserDto.phoneNumber)
            await this.twilio.sendInviteCodeSMS(inviteUserDto.phoneNumber, id);
        else {
        }
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        twilio_service_1.TwilioService])
], UsersService);
//# sourceMappingURL=users.service.js.map
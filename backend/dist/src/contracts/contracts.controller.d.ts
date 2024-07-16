/// <reference types="multer" />
import { ISearch } from '../utils/decorator/SearchDecorator.decorator';
import { Contract } from '@prisma/client';
import { Pagination } from '../utils/decorator/paginationParams.decorator';
import { Sorting } from '../utils/decorator/sortingParams.decorator';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/createContract.dto';
import { AwsS3Service } from '../services/aws-s3.service';
export declare class ContractsController {
    private readonly contractsService;
    private readonly awsS3Service;
    constructor(contractsService: ContractsService, awsS3Service: AwsS3Service);
    getContracts(paginationParams: Pagination, sortingParams: Sorting, searchParam: ISearch): Promise<{
        data: {
            id: number;
            title: string;
            description: string;
            startDate: string;
            endDate: string;
            clientId: string;
            pdfUrl: string;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    getTopContracts(): Promise<({
        taskTemplates: ({
            _count: {
                TaskSchedule: number;
            };
        } & {
            id: number;
            title: string;
            necessaryWorkers: number;
            necessaryTools: string[];
            contractId: number;
            duration: string;
        })[];
    } & {
        id: number;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        clientId: string;
        pdfUrl: string;
    })[]>;
    getContractsByClientId(paginationParams: Pagination, sortingParams: Sorting, searchParam: ISearch, clientId: string): Promise<{
        data: {
            id: number;
            title: string;
            description: string;
            startDate: string;
            endDate: string;
            clientId: string;
            pdfUrl: string;
        }[];
        dataSize: number;
        page: number;
        size: number;
    }>;
    createContract(createContractDto: CreateContractDto, pdf: Express.Multer.File, clientId: string): Promise<{
        id: number;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        clientId: string;
        pdfUrl: string;
    }>;
    getContractById(id: number): Promise<Contract>;
    updateContract(id: number, updateData: any): Promise<{
        id: number;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        clientId: string;
        pdfUrl: string;
    }>;
    deleteContract(id: string): Promise<{
        id: number;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        clientId: string;
        pdfUrl: string;
    }>;
}

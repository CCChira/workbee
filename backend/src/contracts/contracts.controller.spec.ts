import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AwsS3Service } from '../services/aws-s3.service';
import { ConfigModule } from '@nestjs/config';
import { Contract } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('ContractsController', () => {
  let controller: ContractsController;
  let service: ContractsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        ContractsService,
        PrismaService,
        JwtService,
        AwsS3Service,
        PrismaService,
      ],
      imports: [ConfigModule.forRoot({ isGlobal: true })],
    }).compile();

    controller = module.get<ContractsController>(ContractsController);
    service = module.get<ContractsService>(ContractsService);
    jest.spyOn(service, 'createContract').mockResolvedValue({
      data: {
        title: 'New Contract',
        description: 'Detailed description here',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        pdfUrl: null,
        clientId: '0c7c954e-e937-4dde-a30b-0f1c6d28d53b',
        id: 1234,
      },
    } as unknown as Contract);
    jest.spyOn(service, 'updateContract').mockResolvedValue(null);
    jest.spyOn(service, 'deleteContract').mockResolvedValue(null);
  });

  it('should return an array of contracts', async () => {
    const result = await controller.getContracts(
      { page: 1, limit: 10, size: 10, offset: 0 },
      { direction: 'asc', property: 'id' },
      { field: undefined, searchParam: undefined },
    );
    result.data.forEach((contract) => {
      expect(contract.id).not.toBeFalsy();
      expect(contract.clientId).not.toBeFalsy();
    });
    expect(result).toBeInstanceOf(Object);
  });
  it('should create a new contract and return the created data', async () => {
    const createContractDto = {
      title: 'New Contract',
      description: 'Detailed description here',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      pdfUrl: null,
      clientId: '0c7c954e-e937-4dde-a30b-0f1c6d28d53b',
    };
    const result = await controller.createContract(
      createContractDto,
      null,
      createContractDto.clientId,
    );
    expect((result as unknown as { data: Contract }).data).toEqual({
      id: 1234,
      title: 'New Contract',
      description: 'Detailed description here',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      pdfUrl: null,
      clientId: createContractDto.clientId,
    });
    expect(service.createContract).toHaveBeenCalledWith(
      createContractDto,
      createContractDto.clientId,
    );
  });
  describe('updateContract', () => {
    it('should update a contract successfully', async () => {
      const contractData = { title: 'Updated Title' };
      const updatedContract = {
        id: 1234,
        pdfUrl: null,
        title: 'Updated Title',
        description: 'Description',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        clientId: '123',
      };

      jest.spyOn(service, 'updateContract').mockResolvedValue(updatedContract);

      const result = await controller.updateContract(1, contractData);
      expect(result).toEqual(updatedContract);
      expect(service.updateContract).toHaveBeenCalledWith(1, contractData);
    });
    it('should throw a NotFoundException when updating a non-existent contract', async () => {
      jest.spyOn(service, 'updateContract').mockResolvedValue(null);
      await expect(
        controller.updateContract(999, { title: 'Non-existent' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('deleteContract', () => {
    it('should delete a contract successfully', async () => {
      const contractId = '1';
      const deletedContract = {
        id: parseInt(contractId),
        title: 'To Delete',
        description: 'Will be deleted',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        clientId: '123',
        pdfUrl: null,
      };

      jest.spyOn(service, 'deleteContract').mockResolvedValue(deletedContract);

      const result = await controller.deleteContract(contractId);
      expect(result).toEqual(deletedContract);
      expect(service.deleteContract).toHaveBeenCalledWith(parseInt(contractId));
    });
    it('should throw a NotFoundException when deleting a non-existent contract', async () => {
      jest.spyOn(service, 'deleteContract').mockResolvedValue(null);
      await expect(controller.deleteContract('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

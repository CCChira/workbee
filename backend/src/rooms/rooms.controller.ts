import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthDecorators } from '../utils/decorator/AuthDecorators.decorator';
import { AccessMode, Role, Room } from '@prisma/client';
import { RoomsService } from './rooms.service';
import { AwsS3Service } from '../services/aws-s3.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateRoomDto } from './dto/createRoom.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  Pagination,
  PaginationParamsDecorator,
} from '../utils/decorator/paginationParams.decorator';
import {
  Sorting,
  SortingParamsDecorator,
} from '../utils/decorator/sortingParams.decorator';
import {
  ISearch,
  SearchDecorator,
} from '../utils/decorator/SearchDecorator.decorator';

const room: Room = {
  id: 0,
  name: '',
  locationId: 0,
  accessMode: AccessMode.STAIRS,
};

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly awsS3Service: AwsS3Service,
  ) {}
  // @Get()
  // @HttpCode(HttpStatus.OK)
  // @PagSortApiQuery()
  // @SearchApiQuery()
  // @AuthDecorators([Role.ADMIN, Role.CLIENT])
  // public async getRooms(
  //   @PaginationParamsDecorator() paginationParams: Pagination,
  //   @SortingParamsDecorator(Object.keys(room).map((key) => `${key}`))
  //     sortingParams: Sorting,
  //   @SearchDecorator('title') searchParam: ISearch,
  // ) {
  //   const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  //   const allRooms = await this.roomsService.getAllRooms(
  //     paginationParams,
  //     sortingParams,
  //     searchParam,
  //   );
  //
  //
  //   const roomsWithPresignedUrls = await Promise.all(
  //     allRooms.data.map(async (room) => {
  //       const imagesWithPresignedUrls = await Promise.all(
  //         room.images.map(async (image) => {
  //           // Extract the key from the image URL
  //           const s3UrlPrefix = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
  //           const key = image.url.startsWith(s3UrlPrefix)
  //             ? image.url.substring(s3UrlPrefix.length)
  //             : image.url;
  //
  //           // Generate presigned URL
  //           const presignedUrl = await this.awsS3Service.getFileUrl(bucketName, key);
  //
  //           return {
  //             originalUrl: image.url,
  //             presignedUrl,
  //           };
  //         }),
  //       );
  //
  //       return {
  //         ...room,
  //         images: imagesWithPresignedUrls,
  //       };
  //     }),
  //   );
  //
  //   return {
  //     message: 'Rooms and images retrieved successfully',
  //     rooms: roomsWithPresignedUrls,
  //   };
  // }
  // @Get(':id')
  // @HttpCode(HttpStatus.OK)
  // @AuthDecorators([Role.ADMIN, Role.CLIENT])
  // public async getRoom(@Param() { id }: { id: string }) {
  //   return this.roomsService.getRoom(parseInt(id));
  // }
  @Get('/byLocation/:locationId')
  async getRoomsByLocationId(
    @Param('locationId') locationId: string,
    @Query() pagination: Pagination,
    @Query() sorting: Sorting,
  ) {
    console.log(
      'uhwetifgovo89u4wrteyfgvn 45728ty0235n7894tcvnh928y5647tv834o7tyn v4753h8t0wc9tof m2345ryv7toghc4wemu',
    );
    return this.roomsService.getRoomsByLocationId(
      locationId,
      pagination,
      sorting,
    );
  }
  @Get()
  async getRooms(
    @PaginationParamsDecorator() paginationParams: Pagination,
    @SortingParamsDecorator(['name', 'accessMode'])
    sortingParams: Sorting,
    @SearchDecorator('name') searchParams: ISearch,
  ) {
    return this.roomsService.getAllRooms(
      paginationParams,
      sortingParams,
      searchParams,
    );
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getRoomWithImages(@Param('id') id: string) {
    const bucketName = 'workbee-files';

    const room = await this.roomsService.getRoomWithImages(parseInt(id));

    if (!room) {
      return {
        message: `Room with ID ${id} not found`,
        room: null,
      };
    }

    const imagesWithPresignedUrls = await Promise.all(
      room.images.map(async (image) => {
        const s3UrlPrefix = `https://${bucketName}.s3.eu-north-1.amazonaws.com/`;
        const key = image.url.startsWith(s3UrlPrefix)
          ? image.url.substring(s3UrlPrefix.length)
          : image.url;

        const presignedUrl = await this.awsS3Service.getFileUrl(
          bucketName,
          key,
        );

        return {
          originalUrl: image.url,
          presignedUrl,
        };
      }),
    );

    return {
      message: 'Room and images retrieved successfully',
      room: {
        ...room,
        images: imagesWithPresignedUrls,
      },
    };
  }
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('imageFiles', 10))
  @AuthDecorators([Role.ADMIN, Role.CLIENT])
  async createRoomWithImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateRoomDto,
  ) {
    return this.roomsService.createRoomWithImages(body, files);
  }
}

import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
    @Post('cv')
    @UseInterceptors(
    FileInterceptor('cv', {
        storage: diskStorage({
        destination: './public/cvs',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
        }),
        fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new BadRequestException('Only JPG/JPEG/PNG files are allowed!'), false);
        }
        callback(null, true);
        },
        limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
        },
    }),
    )
    async uploadCv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
        throw new BadRequestException('File is required');
    }
    return {
        originalname: file.originalname,
        filename: file.filename,
    };
    }

    @Get('cv/:filename')
    async getCv(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'public/cvs', filename);
    res.sendFile(filePath);
    }
}

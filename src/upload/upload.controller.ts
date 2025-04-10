import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import * as fs from 'fs';

@Controller('upload')
export class UploadController {

    constructor(private userService: UserService) {}

    @Post('cv')
    @UseInterceptors(
    FileInterceptor('cv', {
        storage: diskStorage({
            destination: join(process.cwd(), 'public', 'uploads'),
            filename: (req, file, callback) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              const filename = `${uniqueSuffix}${ext}`;
              callback(null, filename);
            },
        }),          
        fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
            console.log('File type not allowed!');
            return callback(new BadRequestException('Only JPG/JPEG/PNG files are allowed!'), false);
        }
        callback(null, true);
        },
        limits: {
            fileSize: 1024 * 1024 , // 1MB
        },
    }),
    )
    async uploadCv(@UploadedFile() file: Express.Multer.File, @Req() req) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        const userId = req.user.username; 
        const user = await this.userService.findByUsername(userId);

        // Delete old CV if it exists
        if (user.cv_path) {
        const oldPath = join(process.cwd(), 'public', 'uploads', user.cv_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        // Save new path in DB
        await this.userService.update(user.id, { cv_path: file.filename });

        return {
        message: 'CV uploaded and saved!',
        filename: file.filename,
        };
    }

    @Get('cv/:filename')
    async getCv(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = join(process.cwd(), 'public/cvs', filename);
        res.sendFile(filePath);
    }
}

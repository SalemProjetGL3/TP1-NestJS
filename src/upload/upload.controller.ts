import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Res, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import * as fs from 'fs';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
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
                    return callback(new BadRequestException('Only JPG/JPEG/PNG files are allowed!'), false);
                }
                callback(null, true);
            },
            limits: {
                fileSize: 1024 * 1024, // 1MB
            },
        }),
    )
    async uploadCv(@UploadedFile() file: Express.Multer.File, @Req() req) {
        try {
          if (!file) throw new BadRequestException('File is required');

          const user = req.user;
          const oldPath = join(process.cwd(), 'public', 'uploads', user.cv_path?.replace(/"/g, ''));
      
          if (user.cv_path && fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
            console.log('✅ Old CV deleted.');
          }
      
          const updated = await this.userService.update(user.id, { cv_path: file.filename.replace(/"/g, '') });
          console.log('✅ Update result:', updated);
      
          const response = {
            message: 'CV uploaded and saved!',
            filename: file.filename,
          };
          
          console.log('✅ Returning response:', response);
          return response;
      
        } catch (err) {
            console.error('❌ FINAL ERROR:', err.stack || err);
            if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
              throw new BadRequestException('File size exceeds the 1MB limit');
            }
            throw new BadRequestException(err.message || 'Upload failed');
          }
      }      

    @Get('cv/:filename')
    async getCv(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = join(process.cwd(), 'public/cvs', filename);
        res.sendFile(filePath);
    }
}

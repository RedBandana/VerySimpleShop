import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { MAX_FILES_AMOUNT } from 'src/common/constants/general.constant';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

@Injectable()
export class MediaService {
    async uploadFile(
        fileBuffer: Buffer | undefined,
        options: UploadApiOptions,
    ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
        try {
            if (!fileBuffer) return;
            return new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(options, (error, result) => {
                        return result ? resolve(result) : reject(error);
                    })
                    .end(fileBuffer);
            });
        } catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    async uploadFiles(fileBuffers: Buffer[], folder: string): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
        if (fileBuffers.length > MAX_FILES_AMOUNT) {
            throw new Error(`Too many files. ${MAX_FILES_AMOUNT} is the maximum.`);
        }

        const uploadPromises: Promise<UploadApiResponse | UploadApiErrorResponse>[] = fileBuffers.map(
            (fileBuffer, index) => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            {
                                resource_type: 'auto', // Adjust options as necessary
                                public_id: `${folder}/${index}`, // You can customize the public ID as needed
                            },
                            (error, result) => {
                                return result ? resolve(result) : reject(error);
                            },
                        )
                        .end(fileBuffer);
                });
            },
        );

        try {
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error(error);
            throw new Error('Error uploading multiple files: ' + error.message);
        }
    }
}

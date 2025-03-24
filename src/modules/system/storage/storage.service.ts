import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Agent } from 'https';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import * as process from 'process';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    requestHandler: new NodeHttpHandler({
      httpAgent: new Agent({
        keepAlive: true,
        timeout: 600000,
      }),
    }),
  });

  async uploadFileToS3(hash: string, content: Buffer) {
    const key = `${hash}.mp3`;
    await this.s3Client.send(
      new PutObjectCommand({
        Body: content,
        Key: key,
        Bucket: process.env.AWS_BUCKET_NAME,
        ContentType: 'audio/mpeg',
      }),
    );
  }

  async getPresignedUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: 600 });
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      throw error;
    }
  }
}

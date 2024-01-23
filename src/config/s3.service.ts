import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3ConfigService {
  private readonly s3Client: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3({
      accessKeyId: this.configService.get<string>('aws.accessKeyId'),
      secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      region: this.configService.get<string>('aws.region') || 'eu-central-1',
      signatureVersion: this.configService.get<string>('aws.signatureVersion') || 'v4',
    });
  }

  getS3Client(): S3 {
    return this.s3Client;
  }

  getBucketName(): string {
    return this.configService.get<string>('aws.bucketName');
  }

  async uploadBase64Image(base64Image: string, keyName: string): Promise<S3.ManagedUpload.SendData> {
    const buffer = Buffer.from(base64Image, 'base64')

    return await this.s3Client.upload({
      Bucket: this.getBucketName(),
      Key: keyName,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    }).promise();
  }

  async getSignedUrl(keyName: string): Promise<string> {
    if(!keyName) {
      return null;
    }
    
    return await this.s3Client.getSignedUrlPromise('getObject', {
      Bucket: this.getBucketName(),
      Key: keyName,
    });
  }
}

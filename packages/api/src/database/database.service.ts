import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AppDataSource } from './data-source';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private readonly logger = new Logger(DatabaseService.name);

    //OnModuleInit is a NestJS lifecycle hook that runs automatically during application startup.
    async onModuleInit(): Promise<void> {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
                this.logger.log('Database connected successfully');
            }
        } catch (error) {
            this.logger.error('Database connection failed:', error);
            throw error;
        }
    }
}

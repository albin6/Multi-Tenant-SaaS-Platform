import mongoose from 'mongoose';
import { appConfig } from './env.config';
import { logger } from '../utils/logger';

/**
 * Database connection configuration
 * Implements connection retry logic and event handlers
 */
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {}

  /**
   * Singleton pattern to ensure only one database connection instance
   */
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Connect to MongoDB database
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('Database already connected');
      return;
    }

    try {
      // Mongoose connection options
      const options: mongoose.ConnectOptions = {
        maxPoolSize: 10,
        minPoolSize: 5,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
        connectTimeoutMS: 30000, // Connection timeout
        family: 4, // Use IPv4, skip IPv6
        retryWrites: true,
        retryReads: true,
      };

      await mongoose.connect(appConfig.database.uri, options);
      this.isConnected = true;

      logger.info('MongoDB connected successfully');

      this.setupEventHandlers();
    } catch (error) {
      logger.error({ error }, 'MongoDB connection error');
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB database
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error({ error }, 'MongoDB disconnection error');
      throw error;
    }
  }

  /**
   * Setup event handlers for MongoDB connection
   */
  private setupEventHandlers(): void {
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error({ err }, 'Mongoose connection error');
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const database = DatabaseConnection.getInstance();

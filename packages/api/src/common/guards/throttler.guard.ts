import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerOptions, ThrottlerGetTrackerFunction, ThrottlerGenerateKeyFunction } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: ThrottlerOptions,
    getTracker: ThrottlerGetTrackerFunction,
    generateKey: ThrottlerGenerateKeyFunction,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { ip } = request;
    
    // Use IP as the tracker to rate limit per IP address
    request.throttlerKey = ip;
    
    return super.handleRequest(context, limit, ttl, throttler, getTracker, generateKey);
  }
}

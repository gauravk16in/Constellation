// TypeScript resolves this neutral declaration while Metro selects the native or web
// implementation beside it at bundle time.
import type { AppRepository } from '@/data/persistence/app-repository-types';

export declare const appRepository: AppRepository;

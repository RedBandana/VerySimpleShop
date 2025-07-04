import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Model, Query, Document, PipelineStage } from 'mongoose';
import { PaginationOptions } from 'src/common/interfaces/database-request-options.interface';
import { objectToDotNotation } from 'src/common/utils/functions.utils';

@Injectable()
export class DatabaseCollectionService {
    protected query: Query<any, any>;
    constructor(private readonly model: Model<any>) {
        this.model = model;
    }

    async createDocument(group: any): Promise<Document> {
        const record = new this.model(group);
        await record.save();
        return record;
    }

    async updateDocument(documentId: string | ObjectId, updateRequest: any): Promise<any> {
        const correctUpdateRequest = objectToDotNotation(updateRequest);
        const record = await this.model.findByIdAndUpdate(documentId, correctUpdateRequest, { new: true }).lean().exec();
        return record;
    }

    async deleteDocument(documentId: string | ObjectId): Promise<any> {
        const record = await this.model.findByIdAndDelete(documentId).lean().exec();
        return record;
    }

    async documentExists(documentId: ObjectId | string): Promise<boolean> {
        const exists = await this.model.exists({ _id: documentId });
        return exists !== null;
    }

    async documentsExist(documentIds: string[] | ObjectId[]): Promise<boolean> {
        for (const id of documentIds) {
            const exists = await this.model.exists({ _id: id });
            if (!exists) return false;
        }
        return true;
    }

    async getDocumentById(
        documentId: string | ObjectId,
        projection?: any,
    ) {
        return await this.model.findById(documentId).sort({ createdAt: -1 }).select(projection).lean();
    }

    getQuery(documentId: string | ObjectId, projection?: any) {
        const query = this.model.findById(documentId);
        query.lean();
        query.select(projection);
        query.sort({ createdAt: -1 });

        return query;
    }

    async getDocumentByIdLean(documentId: string | ObjectId, projection?: any) {
        this.query = this.model.findById(documentId);
        return await this.query.lean().sort({ createdAt: -1 }).select(projection).exec();
    }

    async getOneDocumentByAggregate(stages: PipelineStage[]): Promise<any> {
        return (await this.model.aggregate(stages))[0];
    }

    async getDocumentsByAggregate(stages: PipelineStage[]): Promise<any[]> {
        return await this.model.aggregate(stages);
    }

    async filterBy(filter: any, option?: PaginationOptions, projection?: any) {
        this.query = this.model.find(filter);
        this.setQueryPipeline(option);
        return await this.query.lean().sort({ createdAt: -1 }).select(projection).exec();
    }

    async getAllDocuments(option?: PaginationOptions, projection?: any) {
        return await this.filterBy({}, option, projection);
    }

    private setQueryPipeline(option?: PaginationOptions) {
        this.setOptionsToQuery(option);
    }

    private setOptionsToQuery(option?: PaginationOptions) {
        if (option) {
            if (option.from >= 0) this.query.skip(option.from);
            if (option.limit > 0) this.query.limit(option.limit);
        }
    }
}

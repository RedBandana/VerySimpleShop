import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Model, PipelineStage } from 'mongoose';
import { IPaginationOptions } from 'src/common/interfaces/database-request-options.interface';
import { objectToDotNotation } from 'src/common/utils/functions.utils';

@Injectable()
export class DatabaseCollectionService {
    constructor(private readonly model: Model<any>) {
        this.model = model;
    }

    async createDocument(document: any): Promise<any> {
        const record = new this.model(document);
        await record.save();
        return record;
    }

    async updateDocument(id: ObjectId, updateRequest: any): Promise<any> {
        const correctUpdateRequest = objectToDotNotation(updateRequest);
        const record = await this.model.findByIdAndUpdate(
            id,
            correctUpdateRequest,
            { new: true, runValidators: true }
        ).lean().exec();
        return record;
    }

    async deleteDocument(id: ObjectId): Promise<any> {
        const record = await this.model.findByIdAndDelete(id).lean().exec();
        return record;
    }

    async getDocument(id: ObjectId, projection?: any): Promise<any> {
        return await this.model.findById(id).sort({ createdAt: -1 }).select(projection).lean();
    }

    async getAllDocuments(option?: IPaginationOptions, projection?: any): Promise<any[]> {
        return await this.filterBy({}, option, projection);
    }

    async getWithAggregate(stages: PipelineStage[]): Promise<any> {
        return (await this.model.aggregate(stages))[0];
    }

    async getManyWithAggregate(stages: PipelineStage[]): Promise<any[]> {
        return await this.model.aggregate(stages);
    }

    async documentExists(id: ObjectId): Promise<boolean> {
        const exists = await this.model.exists({ _id: id });
        return exists !== null;
    }

    async documentsInArrayExist(ids: ObjectId[]): Promise<boolean> {
        for (const id of ids) {
            const exists = await this.model.exists({ _id: id });
            if (!exists) return false;
        }
        return true;
    }

    async filterBy(filter: any, options?: IPaginationOptions, projection?: any): Promise<any[]> {
        const query = this.model.find(filter);
        if (options) {
            if (options.skip >= 0) query.skip(options.skip);
            if (options.limit > 0) query.limit(options.limit);
        }

        return await query.sort({ createdAt: -1 }).select(projection).lean().exec();
    }

    async filterOneBy(filter: any, lean: boolean = true, projection?: any): Promise<any> {
        const query = this.model.findOne(filter).sort({ createdAt: -1 }).select(projection);
        if (lean) query.lean();

        return await query.exec();
    }
}

import { Injectable } from "@nestjs/common";
import { APIModel } from "../model/api-model.model";

export interface APIModelRepository {
  findByCode(code: string): Promise<APIModel | null>;
  findAll(): Promise<APIModel[]>;
  findById(id: string): Promise<APIModel | null>;
  save(apiModel: APIModel): Promise<APIModel>;
}

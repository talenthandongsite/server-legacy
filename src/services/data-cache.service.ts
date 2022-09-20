import { NdxBookData } from "../models/dtos";

export class DataCacheService {

    private ndxBookData: NdxBookData

    getNdxBookData() {
        return this.ndxBookData;
    }

    setNdxBookData(data: NdxBookData) {
        this.ndxBookData = data;
    }
}
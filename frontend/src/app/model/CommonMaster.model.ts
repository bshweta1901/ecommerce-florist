

export class CommonMaster {
    public id: number;
    public search_by?: string;
    public is_active: boolean;
    public status: string;
    public page?: number;
    public per_page?: number;
    public searchValue?: string;
 

    constructor(init?: Partial<CommonMaster>) {
        Object.assign(this, init);
    }

    toJSON(): Partial<CommonMaster> {
        const { search_by, page, per_page, status,searchValue, toJSON, ...rest } = this;
        return rest;
      }
}
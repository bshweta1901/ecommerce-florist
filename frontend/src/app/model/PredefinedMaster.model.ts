export class PredefinedMaster {
    public predefinedId: number;
    public code: string;
    public name: string;
    public id: number;
    public uuid: string;
    public entity_type: string;
    public entityType: string;
    public filterType;
    public moduleMaster;
    public metalName: string;
    public count: number;
    public weight: any;
    public humiditySet: string;
    public phSet: string;
    public search_by: string;
    public customer_type: string;
    public parent_uuid: string;
    public parent: Parent;
    public field1: string;
    public field2: string;
    public field3: string;
    public is_delete: string;
    public url: string;
    public thumbnail: string;
    public service_type: any;
    public package_uuid: any;
    public is_active: boolean;
    public alphabeticOrder: boolean;
    public page: number;
    public per_page: number;
    public page_size: number;
    public page_number: number;
    public searchValue;
    public alphabetical_order: boolean;
}

export class Parent {
    uuid: any;
    name: string;
    code: string;
    entity_type: string;
}

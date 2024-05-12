type Petition = {
    supportingCost: number;
    petitionId: number;
    title: string;
    categoryId: number;
    ownerId: number;
    ownerFirstName: string;
    ownerLastName: string;
    numberOfSupporters: number;
    creationDate: string;
};

type Petitions = {
    petitions: Petition[],
    count: number
}

type PetitionSearch = {
    startIndex: number,
    count?: number,
    q?: string,
    categoryIds?: Array<number>,
    supportingCost?: number,
    ownerId?: number,
    supporterId?: number,
    sortBy?: string
}

type Category = {
    categoryId: number,
    name: string
}
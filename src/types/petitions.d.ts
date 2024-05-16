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

type PetitionFull = {
    description: string,
    moneyRaised: number,
    supportTiers: supportTier[]
} & Petition

type Petitions = {
    petitions: Petition[],
    count: number
}

type PetitionSearch = {
    "startIndex": number,
    "count"?: number,
    "q"?: string,
    "categoryIds"?: number[],
    "supportingCost"?: number,
    "ownerId"?: number,
    "supporterId"?: number,
    "sortBy"?: string
}

type Category = {
    categoryId: number,
    name: string
}

type supportTier = {
    supportTierId: number,
    title: string,
    description: string,
    cost: number
}
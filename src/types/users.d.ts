type User = {
    /**
     * Users first name
     */
    firstName: string;
    /**
     * Users last name
     */
    lastName: string;
    /**
     * Users email address
     */
    email: string;
}

type UserLogin = {
    /**
     * User id as defined by the database
     */
    userId: number;
    /**
     * Users unique token
     */
    token: string;
}

type UserRegister = {
    /**
     * User id as defined by the database
     */
    userId: number;
}
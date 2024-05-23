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

type UserStore = {
    /**
     * User id
     */
    userId: number;
    /**
     * User token
     */
    userToken: string;
    /**
     * User img URL
     */
    userImgURL: string;
}
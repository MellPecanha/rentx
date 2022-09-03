interface IUserResponseDTO {
    name: string;
    email: string;
    id: string;
    avatar: string;
    avatar_url(): string;
    driver_license: string;
}

export {IUserResponseDTO};

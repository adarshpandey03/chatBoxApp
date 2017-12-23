export class FileHolder {
    src: string;
    file: File;
    pending: boolean;
    serverResponse: {
        status: number;
        response: any;
    };
    constructor(src: string, file: File){};
}
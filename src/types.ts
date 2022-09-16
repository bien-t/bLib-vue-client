export interface Author {
    _id:string
    name: string
    books: Book[]
}

export interface Book {
    _id:string
    title: string
    isbn: string
    pages: string
    description: string
    imgUrl: string
    authors: Author[]
}

export type Message = {
    message: string,
    __typename?: string
}
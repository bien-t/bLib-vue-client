import gql from "graphql-tag";

const  addBook = gql`
    mutation AddBook($title:String!,$isbn:String!,$authors:[String!]!,$pages:Int!,$imgUrl:String!,$description:String!){
        bookAdd(title:$title,isbn:$isbn,authors:$authors,pages:$pages,imgUrl:$imgUrl,description:$description){
            book {
                title
                imgUrl
            }
            errors {
                message
            }
        }
    }
`

const userCreate = gql`
    mutation UserCreate($email:String!,$password:String!){
        userCreate(email:$email,password:$password){
            user {
            _id
            email
            books {
                    book {
                        _id
                    }
                }
            }
            errors{
                message
            }
            token
        }
    }
`

const userLogin = gql`
    mutation UserLogin($email:String!,$password:String!){
        userLogin(email:$email,password:$password){
            user {
                _id
                email
                books {
                    book {
                        _id
                    }
                }
            }
            errors {
                message
            }
            token
        }
    }
`

const changeEmail = gql`
    mutation ChangeEmail($email:String!,$emailConfirm:String!,$id:ID!){
        changeEmail(email:$email,emailConfirm:$emailConfirm,_id:$id){
            message
            email
            errors {
                message
            }
        }
    }
`

const changePassword = gql`
    mutation ChangePassword($password:String!,$passwordConfirm:String!,$id:ID!){
        changePassword(password:$password,passwordConfirm:$passwordConfirm,_id:$id){
            message
            errors {
                message
            }
        }
    }
`

const addToCollection = gql`
    mutation AddToCollection($bookId:ID!,$userId:ID!,$bookStatus:String!){
        addToCollection(bookId:$bookId,userId:$userId,bookStatus:$bookStatus){
            errors {
                message
            }
            userBooks {
                _id
            }
            message
        }
    }
`

const changeBookStatus = gql`
    mutation ChangeBookStatus($bookId:ID!,$userId:ID!,$newStatus:String!){
        changeBookStatus(bookId:$bookId,userId:$userId,newStatus:$newStatus){
            errors {
                message
            }
            message
            userBooks {
                    _id
                    status
                }
        }
    }
`
const removeFromCollection = gql`
    mutation removeFromCollection($bookId:ID!,$userId:ID!){
        removeFromCollection(bookId:$bookId,userId:$userId){
            errors {
                message
            }
            message
        }
    }
`
export  {
    addBook,
    userCreate,
    userLogin,
    changeEmail,
    changePassword,
    addToCollection,
    changeBookStatus,
    removeFromCollection
}
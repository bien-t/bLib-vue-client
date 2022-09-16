import gql from "graphql-tag";

const authorFragment = gql`
fragment authorFragment on Author {
  _id
  name
}
`

const bookFragment = gql`
fragment bookFragment on Book {
  _id
  title
  imgUrl
}
`

const querySearch = gql`
${authorFragment}
${bookFragment}

query Search($data:String!,$category:Category!) {
    search(data:$data,category:$category) {
       __typename
        ... on BooksPayload {

        books {
          ...bookFragment
        isbn
        authors {
          ...authorFragment
        }
        }
}
    ... on AuthorsPayload {
      authors{
      ...authorFragment

      }
    }
    }
  }
`

const queryBooks = gql`
${authorFragment}
${bookFragment}
  query GetBooks{
    getBooks{
      books{
        ...bookFragment
        authors {
         ...authorFragment
        }
      }
    }
  }
`

const queryUser = gql`
query GetUser($id:ID!){
    getUser(userId:$id){
      user {
        _id
        email
        books {
          book{
            _id
          }
        }
      }
    errors {
      message
    }
    }
}
`

const queryUserCollection = gql`
${authorFragment}
${bookFragment}
query GetUserCollection($id:ID!,$bookFilter:String){
    getUser(userId:$id,,bookFilter:$bookFilter){
      user {
        books {
          book {
            ...bookFragment

            authors {
              ...authorFragment
            }
            isbn
          }
          status
          _id
        }
      }
    errors {
      message
    }
    }
}
`

const queryUserBooks = gql`
query GetUserBooks($userId:ID!){
    getUser(userId:$id){
      user {
        books{
          book {
          _id
        }
      }
    }
    errors {
      message
    }
    }
}
`

const queryBook = gql`
${authorFragment}
${bookFragment}
query GetBook($id:ID!){
    getBook(bookId:$id){
      book{
        ...bookFragment
      isbn
      description
      authors {
        ...authorFragment
        }
      }
      errors {
        message
      }
    }
}
`

const queryAuthor = gql`
${authorFragment}
${bookFragment}

query GetAuthor($id:ID!){
  getAuthor(authorId:$id){
    author {
      ...authorFragment
      books {
        ...bookFragment
      }
    }
  }
}
`

export {
  querySearch,
  queryBooks,
  queryUser,
  queryBook,
  queryAuthor,
  queryUserCollection,
  queryUserBooks
}
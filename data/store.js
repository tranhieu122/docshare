const documents = [];
const comments = [];
let nextDocumentId = 1;
let nextCommentId = 1;

function addDocument(document) {
    const saved = {
        ma_tai_lieu: nextDocumentId++,
        ...document
    };
    documents.push(saved);
    return saved;
}

function addComment(comment) {
    const saved = {
        ma_binh_luan: nextCommentId++,
        ...comment
    };
    comments.push(saved);
    return saved;
}

function deleteDocument(docId) {
    const index = documents.findIndex(doc => doc.ma_tai_lieu === docId);
    if (index !== -1) {
        documents.splice(index, 1);
        return true;
    }
    return false;
}

function deleteComment(commentId) {
    const index = comments.findIndex(c => c.ma_binh_luan === commentId);
    if (index !== -1) {
        comments.splice(index, 1);
        return true;
    }
    return false;
}

module.exports = {
    documents,
    comments,
    addDocument,
    addComment,
    deleteDocument,
    deleteComment
};
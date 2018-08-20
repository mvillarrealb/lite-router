module.exports = {
    POST: {
        id: "first-task-id",
        name : "Make the weekly food shopping",
        is_done: false
    },
    GET: {
        items: [

        ]
    },
    PUT: {
        id: "my-second-task",
        update: {
            is_done: true
        },
        record: {
            id: "my-second-task",
            name : "Make a unit test",
            is_done: false
        }
    },
    GET_ONE: {
        id: "my-third-record",
        record: {
            id: "my-third-record",
            name : "Make a integ test",
            is_done: true
        }
    },
    DESTROY: {
        id: "my-fourth-record",
        record: {
            id: "my-fourth-record",
            name : "Make a integ test",
            is_done: true
        }
    }
}
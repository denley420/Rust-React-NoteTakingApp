export const idl =
{
    "version": "0.1.0",
    "name": "noter",
    "instructions": [
        {
            "name": "createNote",
            "accounts": [
                {
                    "name": "note",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "content",
                    "type": "string"
                }
            ]
        },
        {
            "name": "deleteNote",
            "accounts": [
                {
                    "name": "note",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "Note",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "name": "user",
                        "type": "publicKey"
                    }
                ]
            }
        }
    ],
    "metadata": {
        "address": "7dqNzgT2AMiQczX7X8h7y9b5bV6ssDqihJsrxAhCnYgH"
    }
}
import {useHocuspocusAwareness} from '@hocuspocus/provider-react'

export function UserCount() {
    const users = useHocuspocusAwareness();

    console.log(users);
    return (
        <div>
            {users.length} online
        </div>
        // <div className="avatars">
        //     {users.map((user) => (
        //         <div
        //             key={user.clientId}
        //             style={{backgroundColor: user.color as string}}
        //             title={user.name as string}
        //         >
        //             {(user.name as string | undefined)?.[0]}
        //         </div>
        //     ))}
        // </div>
    )
}
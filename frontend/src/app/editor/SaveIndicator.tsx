import {useHocuspocusSyncStatus} from '@hocuspocus/provider-react'

export function SaveIndicator() {
    const syncStatus = useHocuspocusSyncStatus()

    return <div>{syncStatus === 'syncing' ? 'Saving…' : 'All changes saved'}</div>;
}
export { }


export interface routine {
    name: string,
    days: Array<number>,
    action: string,
    state: number,
    timer: [{
        hour: number,
        minute: number
    }],
    ars: Array<string>
}
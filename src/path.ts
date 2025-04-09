const ticketsPath = () => '/tickets'

function ticketPath(tickeId: string):string {
    return `${ticketPath}/${tickeId}`
}

export {ticketPath,ticketsPath}
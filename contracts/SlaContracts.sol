pragma solidity ^0.4.18;

contract SlaContracts {

    struct Contract{
        uint id;
        string name;
        address customer;
        address provider;
        uint256 delayTime; //minutes
        uint256 delayPrice; //ETH per minute
    }
    
    mapping(address => uint) public ProvidersAccount;

    mapping(uint => Contract) public Contracts;
    uint ContractCounter;

    struct Ticket{
        uint id;
        uint contractId;
        uint256 dateStart;
        uint256 dateEnd;
        uint256 penalty;
        string comment;
        string description;
    }

    mapping(uint => Ticket) public Tickets;
    uint TicketCounter;

    struct Provider{
        uint id;
        address account;
        string name;
    }

    mapping(uint => Provider) public Providers;
    uint ProviderCounter;

    function CreateProvider(address account, string name) payable public {
        ProviderCounter++;

        Providers[ProviderCounter] = Provider(
            ProviderCounter,
            account,
            name
        );

        ProvidersAccount[account] = msg.value;
    }

    function getAmount(address account) public view returns(uint){
        return ProvidersAccount[account];
    }

    function CreateContract(string _name, address _provider, uint256 _delayTime, uint256 _delayPrice) public {
        ContractCounter++;
        
        Contracts[ContractCounter] = Contract(
            ContractCounter,
            _name,
            msg.sender,
            _provider,
            _delayTime,
            _delayPrice
        );
    }

    function getContracts() public view returns(uint[]){
        uint[] memory contractIds = new uint[](ContractCounter);

        for(uint i=1; i <= ContractCounter; i++){
            contractIds[i - 1] = Contracts[i].id;
        }

        return contractIds;
    }

    function CreateTicket(uint _contractId, string _description) public {
        TicketCounter++;

        Tickets[TicketCounter] = Ticket(
            TicketCounter,
            _contractId,
            now,
            0x0,
            0x0,
            "",
            _description
        );
    }

    function getTicketsByProvider(address _provider) public view returns(uint[]){
        uint[] memory ticketIds = new uint[](TicketCounter);
        uint numberOfTickets = 0;

        for(uint i=1; i <= TicketCounter; i++ ){
            Contract memory slaContract = Contracts[Tickets[i].contractId];

            if(slaContract.provider == _provider){
                ticketIds[numberOfTickets] = Tickets[i].id;
                numberOfTickets++;
            }
        }

        uint[] memory tickets = new uint[](numberOfTickets);
        for(uint j= 0; j < numberOfTickets; j++){
            tickets[j] = ticketIds[j];
        }

        return tickets;
    }
    
    function CloseTicket(uint _id, string _comment) public {
        Ticket storage ticket = Tickets[_id];
        Contract memory slaContract = Contracts[ticket.contractId];
        uint256 ticketDuration = now - ticket.dateStart;
        ticket.comment = _comment;
        ticket.dateEnd = now;
        ticket.penalty = ticketDuration * slaContract.delayPrice;
        slaContract.customer.transfer(ticket.penalty);
    }

    function GetTime() public view returns (uint256){
        return now;
    }

    function GetBalance() public view returns (uint256){
        return (address(this)).balance;
    }
}
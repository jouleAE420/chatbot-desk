export interface CityEntityOptions {
    name: string;
    rate: number;
    state: string;
    id: string;
}

export class CityEntity {
    public name: string;
    public state: string;
    public rate: number;
    public id: string;

    constructor(options: CityEntityOptions) {
        const { name, rate, id,state } = options;
        this.name = name;
        this.state =state;
        this.rate = rate;
        this.id = id;
    }
    static fromJson = (json: string): CityEntity => {
        const { name, rate, id ,state} = JSON.parse(json);
        const city = new CityEntity({
            name,
            rate,
            id,
            state
        });
        return city;
    };
    static fromObject = (object: { [key: string]: any }): CityEntity => {
        const { name, rate, id ,state} = object;
        const city = new CityEntity({
            name,
            rate,
            id,
            state
        });
        return city;
    };
}

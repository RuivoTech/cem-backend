import path from "path";

module.exports = {
    client: 'mysql',
    connection: {
        host: "localhost",
        user: "richieri",
        password: "Beatricy1812@",
        database: "cem_testes"
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    }
}
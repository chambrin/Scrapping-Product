import inquirer from 'inquirer';
import {Ekosport} from "../services/ekosport";

export const Service: { [key: string]: () => void } = {
    Ekosport
}

// Get the names of the services from the Service object
const services = Object.keys(Service);
services.push('ALL Service');

export function startServices() {
    inquirer
        .prompt([
            {
                type: 'checkbox',
                message: 'Select services',
                name: 'services',
                choices: services,
                validate: function(answer: string[]) {
                    if (answer.length < 1) {
                        return 'You must choose at least one service.';
                    }
                    return true;
                }
            }
        ])
        .then((answers: { services: string[] }) => {
            if (answers.services.includes('ALL Service')) {
                // If "ALL Service" is selected, run all services
                console.log('Running all services...');
                Object.values(Service).forEach(service => service());
            } else {
                // Otherwise, run the selected services
                console.log(`Running selected services: ${answers.services.join(', ')}`);
                answers.services.forEach((service: string) => {
                    if (Service[service]) {
                        Service[service]();
                    }
                });
            }
        });
}
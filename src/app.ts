import './Infra/Framework/module-aliases'
import '@Infra/Framework/config'
import '@Infra/Framework/Express'
import "@Infra/RabbitMQ/RabbitConnector"

export function debug(text: any, status?: 'ok'|'error'|'warning'|'info'|'common') {

    const prefix = '[ * Debugger * ]'.green.bold;

    if (status === 'common' || !status) {
        console.log(prefix)
        console.log(text)
        return
    }

    const typeStatus = {
        info: 'white',
        ok: 'cyan',
        error: 'red',
        warning: 'yellow',
    };

    console.log(prefix + ' ' + text[typeStatus[status]])
    console.log('\n')
}

// import './EmailSenderTest'


module.exports = [
    {
        baseUrl: 'tinkoff.ru',
        url: 'https://api.tinkoff.ru/v1/sign_up',
        method: 'post',
        type: 'FormData',
        body: (phone, name) => ({
            phone,
        }),
        parse: 'json',
        isSuccess: res => res && res.resultCode && res.resultCode === 'WAITING_CONFIRMATION'
    },
    {
        baseUrl: 'youla.ru',
        url: 'https://youla.ru/web-api/auth/request_code',
        method: 'post',
        type: 'FormData',
        body: (phone, name) => ({
            phone,
        }),
        parse: 'json',
        isSuccess: res => res && res.code_length && res.code_length == 6
    },
    {
        baseUrl: 'raketaapp.com',
        url: 'https://api.raketaapp.com/v1/auth/otps',
        method: 'post',
        type: 'FormData',
        body: (phone, name) => ({
            phone: phone.substr(1),
        }),
        parse: 'json',
        isSuccess: res => res && res.success
    },
    {
        baseUrl: 'sweet.tv',
        url: 'https://api.sweet.tv/SignupService/SetPhone.json',
        method: 'post',
        body: (phone, name) => ({
            phone: phone.substr(1),
            locale: 'uk',
            device: {
                type: 'DT_Web_Browser',
            },
        }),
        parse: 'json',
        isSuccess: res => res && res.status && res.status === 'OK'
    },
    {
        baseUrl: 'ontaxi.com.ua',
        url: 'https://ontaxi.com.ua/api/v2/web/client',
        method: 'post',
        body: (phone, name) => ({
            phone: phone.substr(3),
            country: 'UA'
        }),
        parse: 'json',
        isSuccess: res => res && res.ok
    },
]

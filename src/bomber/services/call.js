const nonce = require('../utils/nonce')

module.exports = [
    {
        baseUrl: 'gabarchi.com.ua',
        url: 'https://gabarchi.com.ua/kontakty/',
        method: 'post',
        type: 'FormData',
        body: (phone, name) => ({
            'input_1.3': name,
            'input_2': phone, // +380
            'gform_ajax': 'form_id=1&title=&description=&tabindex=1',
            'is_submit_1': 1,
            'gform_submit': 1,
        }),
        parse: 'text',
        isSuccess: res => res.indexOf('Дякуємо') !== -1
    },
    // {
    //     url: 'https://beclean.com.ua/wp-admin/admin-ajax.php',
    //     method: 'post',
    //     type: 'FormData',
    //     body: phone => ({
    //         phone, // +380
    //         name: name,
    //         action: 'vdz_cb_send',
    //         _wpnonce: '1', // nonce(),
    //         _wp_http_referer: '/service/генеральне-прибирання/',
    //     }),
    //     parse: 'json',
    //     isSuccess: res => res && res.status && res.status === 'success'
    // },
    {
        baseUrl: '3gstar.com.ua',
        url: 'https://3gstar.com.ua/gsubmitclick.php',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            phone, // +380
        }),
        parse: 'text',
        isSuccess: res => res.indexOf('ajax-success') !== -1
    },
    {
        baseUrl: 'ledia.sumy.ua',
        url: 'https://eledia.sumy.ua/wp-json/contact-form-7/v1/contact-forms/300/feedback',
        method: 'post',
        type: 'FormData',
        body: (phone, name) => ({
            'text-856': name,
            'tel-502': phone, // +380
            'honeypot-839': '',
            '_wpcf7': '300',
            '_wpcf7_unit_tag': 'wpcf7-f300-o2',
        }),
        parse: 'json',
        isSuccess: res => res && res.status && res.status === 'mail_sent'
    },
    // {
    //     baseUrl: 'copyright.royalty.in.ua',
    //     url: 'https://copyright.royalty.in.ua/wp-json/contact-form-7/v1/contact-forms/167/feedback',
    //     method: 'post',
    //     type: 'FormData',
    //     body: (phone, name) => ({
    //         'tel-115': phone, // +380
    //         '_wpcf7': 165,
    //         '_wpcf7_nonce': nonce(),
    //         'imya': name
    //     }),
    //     parse: 'json',
    //     isSuccess: res => res && res.status && res.status === 'mail_sent'
    // },
    {
        baseUrl: 'www.znet.lviv.ua',
        url: 'http://www.znet.lviv.ua/php/process.php',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            'subscriber': phone.substr(1), // 380
        }),
        parse: 'text'
    },
    {
        baseUrl: 'cronvest.com',
        url: 'https://cronvest.com/wp-admin/admin-ajax.php',
        method: 'post',
        type: 'FormData',
        body: n => ({
            popup_contact_tel: `${n[0]+n[1]+n[2]}(${n[3]+n[4]+n[5]}) ${n[6]+n[7]+n[8]}-${n[9]+n[10]}-${n[11]+n[12]}`, // +38(050) 516-57-77
            action: 'contact_form_popup',
        }),
        parse: 'json',
        isSuccess: res => res && res.success
    },
    {
        baseUrl: 'www.mytrinity.com.ua',
        url: 'https://www.mytrinity.com.ua/api.php',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            phone: phone, // +380
            type: 'recall',
        }),
        parse: 'json',
        isSuccess: res => res && res.status
    },
    {
        baseUrl: 'testmetrstandart.com.ua',
        url: 'https://testmetrstandart.com.ua/wp-json/contact-form-7/v1/contact-forms/61/feedback',
        method: 'post',
        type: 'FormData',
        body: (phone, name) => ({
            'tel-88': phone, // +380
            'your-name': name,
            '_wpcf7': 61,
        }),
        parse: 'json',
        isSuccess: res => res && res.status && res.status === 'mail_sent'
    },
    {
        baseUrl: 'findclone.ru',
        url: number => `https://findclone.ru/register?phone=${number}`,
        method: 'get',
        parse: 'json',
        isSuccess: res => res && res.userid
    },
    {
        baseUrl: 'gmt.net.ua',
        url: 'https://gmt.net.ua/wp-json/contact-form-7/v1/contact-forms/262/feedback',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            'tel-981': phone, // +380
            '_wpcf7': 262,
        }),
        parse: 'json',
        isSuccess: res => res && res.status && res.status === 'mail_sent'
    },
    {
        baseUrl: 'akos-studio.com',
        url: 'http://akos-studio.com/ua/component/rsform/?task=ajaxValidate',
        method: 'post',
        type: 'FormData',
        body: phone => ({
            'form[Phone]': phone, // +380
            'form[formId]': 5,
        }),
        parse: 'text',
        isSuccess: res => res.indexOf('Thank you') !== -1
    },
    {
        baseUrl: 'unidirection.com.ua',
        url: 'https://unidirection.com.ua/wp-json/contact-form-7/v1/contact-forms/3572/feedback',
        method: 'post',
        type: 'FormData',
        body: (phone, name) => ({
            'tel-748': phone.substr(3), // 095
            'your-name': name,
        }),
        parse: 'json',
        isSuccess: res => res && res.status && res.status === 'mail_sent'
    },
    {
        baseUrl: 'inta-ics.com',
        url: 'https://inta-ics.com/api',
        method: 'post',
        type: 'FormData',
        body: (n, name) => ({
            phone: `${n[0]+n[1]+n[2]}(${n[3]+n[4]+n[5]}) ${n[6]+n[7]+n[8]}-${n[9]+n[10]}-${n[11]+n[12]}`, //! +38(050) 516-57-77
            name,
            url: 'https://inta-ics.com/kontaktyi/',
            title: 'страница контактов',
        }),
        parse: 'text',
        isSuccess: res => res.indexOf('1') !== -1
    },
    {
        baseUrl: 'idermic.com.ua',
        url: 'https://cstat.nextel.com.ua:8443/tracking/clickToCall/callbackNow',
        method: 'post',
        type: 'FormData',
        body: (phone, name) => ({
            phone: phone.substr(1), // 380
            customerName: name,
            projectId: 1428,
            siteId: 613,
            googleId: '540238400.1611831384',
            utm: 'https://idermic.com.ua/',
            source: 'WIDGET'
        }),
        parse: 'json',
        isSuccess: res => res && res.status && res.status === 'Success'
    },
    {
        baseUrl: 'brovacar.ua',
        url: 'https://brovacar.ua/uk/ajax/callback',
        method: 'post',
        type: 'FormData',
        body: (n, name) => ({
            phone: `${n[0]+n[1]+n[2]+n[3]} (${n[4]+n[5]}) ${n[6]+n[7]+n[8]} ${n[9]+n[10]+n[11]+n[12]}`, // +380 (50) 516 5777
        }),
        parse: 'text'
    },
    {
        baseUrl: 'vpodobayka.com',
        url: 'https://vpodobayka.com/wp-admin/admin-ajax.php',
        method: 'post',
        type: 'FormData',
        body: (phone, name) => ({
            post_id: 316,
            form_id: '98011dd',
            queried_id: 810,
            'form_fields[name]': name,
            'form_fields[field_7e3ac64]': phone,
            action: 'elementor_pro_forms_send_form',
            referrer: 'https://vpodobayka.com/ru/catalog/zhinkam/domashnij-komplekt-4-rechi-halat-majka-shtany-shorty/',
        }),
        parse: 'json',
        isSuccess: res => res && res.success
    },
    {
        baseUrl: 'nadiyabud.coma',
        url: 'https://nadiyabud.com/form/mail.php',
        method: 'post',
        type: 'FormData',
        body: (phone, name) => ({
            'formservices[]': '1d4b91853ae74bc9b70f8b75bce20c34',
            tspecomment: 'nadiyabud.com',
            Vashnomertelefona: phone,
            Vasheimya: name,
        }),
        parse: 'text',
        isSuccess: res => res.indexOf('Спасибо') !== -1
    },
    {
        baseUrl: 'www.ganz-paintball.com',
        url: 'https://www.ganz-paintball.com/wp-json/contact-form-7/v1/contact-forms/769/feedback',
        method: 'post',
        type: 'FormData',
        body: (n, name) => ({
            'tel-112': `${n[0]+n[1]+n[2]}(${n[3]+n[4]+n[5]})${n[6]+n[7]+n[8]}-${n[9]+n[10]+n[11]+n[12]}`, //! +38(050)516-5777
            'your-name': name,
        }),
        parse: 'json',
        isSuccess: res => res && res.status && res.status === 'mail_sent'
    },
]

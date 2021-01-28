const crypto = require('crypto')

const nonce = () => crypto.randomBytes(5).toString('hex')

module.exports = {
    calls: [
        {
            url: 'https://gabarchi.com.ua/kontakty/',
            method: 'post',
            type: 'FormData',
            body: phone => ({
                'input_1.3': 'Name',
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
        //         name: 'Name',
        //         action: 'vdz_cb_send',
        //         _wpnonce: '1', // nonce(),
        //         _wp_http_referer: '/service/генеральне-прибирання/',
        //     }),
        //     parse: 'json',
        //     isSuccess: res => res && res.status && res.status === 'success'
        // },
        {
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
            url: 'https://eledia.sumy.ua/wp-json/contact-form-7/v1/contact-forms/300/feedback',
            method: 'post',
            type: 'FormData',
            body: phone => ({
                'text-856': 'Name',
                'tel-502': phone, // +380
                'honeypot-839': '',
                '_wpcf7': '300',
                '_wpcf7_unit_tag': 'wpcf7-f300-o2',
            }),
            parse: 'text',
            isSuccess: res => res && res.status && res.status === 'mail_sent'
        },
        {
            url: 'https://copyright.royalty.in.ua/wp-json/contact-form-7/v1/contact-forms/167/feedback',
            method: 'post',
            type: 'FormData',
            body: phone => ({
                'tel-115': phone, // +380
                '_wpcf7': 165,
                '_wpcf7_nonce': nonce(),
                'imya': 'Валентин'
            }),
            parse: 'json',
            isSuccess: res => res && res.status && res.status === 'mail_sent'
        },
        {
            url: 'http://www.znet.lviv.ua/php/process.php',
            method: 'post',
            type: 'FormData',
            body: phone => ({
                'subscriber': phone.substr(1), // 380
            }),
            parse: 'text'
        },
        {
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
            url: 'https://testmetrstandart.com.ua/wp-json/contact-form-7/v1/contact-forms/61/feedback',
            method: 'post',
            type: 'FormData',
            body: phone => ({
                'tel-88': phone, // +380
                'your-name': 'Name',
                '_wpcf7': 61,
            }),
            parse: 'json',
            isSuccess: res => res && res.status && res.status === 'mail_sent'
        },
        {
            url: number => `https://findclone.ru/register?phone=${number}`,
            method: 'get',
            parse: 'json',
            isSuccess: res => res && res.userid
        },
        {
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
    ]
}
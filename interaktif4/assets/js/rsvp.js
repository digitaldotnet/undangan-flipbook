import { supabase } from './supabase.js';

export function initRsvp(groupName) {
    $('#btnRsvp').on('click', async function () {
    const name = $('#rsvpName').val().trim();
    const status = $('#rsvpStatus').val();

    if (!name || !status) {
        $('#rsvpPop').removeClass('d-none').html('Nama dan kehadiran wajib diisi');
        return;
    }

    const { error } = await supabase
        .from('Rsvp')
        .insert({
        name: name,
        isattand: status,
        group: groupName
        });

    if (error) {
        $('#rsvpPop').removeClass('d-none').html('RSVP gagal dikirim');
        return;
    }

    $('#rsvpName').val('');
    $('#rsvpStatus').val('');

    $('#rsvpPop').removeClass('d-none')
        .html('🙏 Terima kasih atas konfirmasinya');
    });
}
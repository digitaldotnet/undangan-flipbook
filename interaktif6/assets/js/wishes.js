import { supabase } from './supabase.js';

export function initWishes(groupName) {
    /* ===== LOAD AWAL (NEWEST FIRST) ===== */
    async function loadUcapan() {
    const { data, error } = await supabase
        .from('Tamu')
        .select('*')
        .eq('Group', groupName)
        .order('created_at', { ascending: false });

    if (error) return console.error(error);

    $('.wishes-list').html('');
    data.forEach(item => renderItem(item, false));
    }
    loadUcapan();

    /* ===== REALTIME ===== */
    supabase
    .channel(`tamu-${groupName}`)
    .on(
        'postgres_changes',
        {
        event: 'INSERT',
        schema: 'public',
        table: 'Tamu',
        filter: `Group=eq.${groupName}`
        },
        payload => {
        renderItem(payload.new, true);
        }
    )
    .subscribe();

    /* ===== SUBMIT ===== */
    $('#btnKirim').on('click', async function () {
    const name = $('#name').val().trim();
    const comment = $('#comment').val().trim();

    if (!name || !comment) {
        $('#wishPop').removeClass('d-none');
        $('#wishPop').html('Nama dan ucapan wajib diisi');
        return;
    }

    const { error } = await supabase.from('Tamu').insert({
        Name: name,
        Coment: comment,
        Group: groupName
    });

    if (error) {
        $('#wishPop').removeClass('d-none');
        $('#wishPop').html('Ucapan tidak terkirim');
        return;
    }

    $('#name').val('');
    $('#comment').val('');

    $('#wishPop').removeClass('d-none');
    $('#wishPop').html('💌 Ucapan berhasil dikirim!');
    });

    /* ===== RENDER ITEM ===== */
    function renderItem(item, prepend) {
    const html = `
    <div class="wish-card">
                <div class="wish-header">
                <span class="wish-name">${escapeHtml(item.Name)}</span>
                <span class="wish-time">${formatDate(item.created_at)}</span>
                </div>
                <div class="wish-message">
                ${escapeHtml(item.Coment)}
                </div>
            </div>
    `;

    prepend
        ? $('.wishes-list').prepend(html)
        : $('.wishes-list').append(html);
    }

    /* ===== DATE FORMAT ===== */
    function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    }

    /* ===== XSS PROTECT ===== */
    function escapeHtml(text) {
    return text.replace(/[&<>"']/g, m =>
        ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])
    );
    }
}
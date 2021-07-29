<template>
    <q-card class="rounded-borders q-my-md" bordered flat>
        <q-card-section>
            <q-markup-table flat>
                <thead>
                <tr>
                    <th class="text-center"><span class="text-subtitle1 text-uppercase tracking-wider"> {{ $tc('symbol') }} </span></th>
                    <th class="text-left"><span class="text-subtitle1 text-uppercase tracking-wider"> {{ $tc('description') }} </span></th>
                    <th class="text-left"><span class="text-subtitle1 text-uppercase tracking-wider"> {{ $tc('description') }} </span></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(token, index) in tokens" :key="index">
                    <td class="text-center"><span class="text-subtitle1 text-secondary tracking-wide">{{ token.symbol }} </span></td>
                    <td class="text-left"><span class="text-subtitle1 text-secondary tracking-wide"> {{ token.description_en }} </span></td>
                    <td class="text-left"><span class="text-subtitle1 text-secondary tracking-wide"> {{ token.description_th }} </span></td>
                </tr>
                </tbody>
            </q-markup-table>
        </q-card-section>
    </q-card>
</template>

<script>
export default {
    data() {
        return {
            tokens: [
                { symbol: "#", description_en: "Numeric", description_th: "ตัวเลข" },
                { symbol: "S", description_en: "Letter, a to z, case insensitive", description_th: "ตัวอักษร a ถึง z ไม่คำนึงถึงตัวพิมพ์เล็กและใหญ่" },
                { symbol: "N", description_en: "Alphanumeric, case insensitive for letters", description_th: "ตัวอักษรและตัวเลข ไม่คำนึงถึงตัวพิมพ์เล็กและใหญ่สำหรับตัวอักษร" },
                { symbol: "A", description_en: "Letter, transformed to uppercase", description_th: "ตัวอักษร เปลี่ยนเป็นตัวพิมพ์ใหญ่" },
                { symbol: "a", description_en: "Letter, transformed to lowercase", description_th: "ตัวอักษร เปลี่ยนเป็นตัวพิมพ์เล็ก" },
                { symbol: "X", description_en: "Alphanumeric, transformed to uppercase for letters", description_th: "ตัวอักษรและตัวเลข เปลี่ยนเป็นตัวพิมพ์ใหญ่สำหรับตัวอักษร" },
                { symbol: "x", description_en: "Alphanumeric, transformed to lowercase for letters", description_th: "ตัวอักษรและตัวเลข เปลี่ยนเป็นตัวพิมพ์เล็กสำหรับตัวอักษร" },
            ],
        }
    }
}
</script>

<style scoped>
</style>
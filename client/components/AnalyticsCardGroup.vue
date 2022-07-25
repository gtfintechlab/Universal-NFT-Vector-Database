<template>
    <div class="card-group-container">
        <AnalyticsCard v-for="card in config"
                        :title="card.title"
                        :statistic="card.statistic"
                        :subtitle="card.subtitle"
                        :isLoading="isLoading"
                        class="card"></AnalyticsCard>
    </div>
</template>

<script>
import { mockAnalyticsCardGroup } from '../utils/MockData';
import AnalyticsCard from './AnalyticsCard.vue';

export default{
    name: 'AnalyticsCardGroup',
    props: {
        config: {
            type: null,
            default: mockAnalyticsCardGroup,
            required: false
        },
        direction: {
            type: String,
            default: "row",
            required: false
        },
        isLoading: {
            type: Boolean,
            default: true,
            required: false
        }
    },
    components: { AnalyticsCard }
}
</script>

<style scoped>
.card-group-container{
    display: flex;
    flex-direction: v-bind('direction');
    margin: 25px;
    gap: 20px;
    flex-wrap: wrap;
}

.card{
    flex: 1 1;
}

</style>
<script setup>
defineEmits(['close']);
</script>

<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <div class="modal-header">
                <span class="close" @click="$emit('close')">&times;</span>
                <slot name="header"></slot>
            </div>

            <div class="modal-body">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    z-index: 10000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: var(--card-background, #fff);
    border-radius: 8px;
    padding: 20px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.modal-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 10px;
    margin-bottom: 15px;
}

.modal-body {
    overflow-y: auto;
    flex-grow: 1;
}

.close {
    float: right;
    font-size: 2rem;
    cursor: pointer;
    line-height: 20px;
}
</style>
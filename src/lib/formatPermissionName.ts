export const formatPermissionName = (name: string) => {
    return name.split(':')
        .map((segment, index) => index === 0 ? segment : segment.charAt(0).toUpperCase() + segment.slice(1))
        .join('');
};
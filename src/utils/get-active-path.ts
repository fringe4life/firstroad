import {closest} from 'fastest-levenshtein'


export const getActivePath = (path: string, paths: string[], excludedPaths?: string[]): {active: string, activeIndex: number} => {
    const closestPath = closest(path, paths.concat(excludedPaths || []));
    const closestPathIndex = paths.indexOf(closestPath);
    return {active: closestPath, activeIndex: closestPathIndex};
}
class MatrixTraversal:

    def traverse(self, matrix):

        cells = []

        for row in matrix:
            for cell in row:
                cells.append(cell)

        return cells

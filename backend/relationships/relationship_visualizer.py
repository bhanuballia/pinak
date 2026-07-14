# relationships/relationship_visualizer.py

def render_matrix(
    matrix
):

    for p1, row in matrix.items():

        print("\n", p1)

        for p2, rel in row.items():

            print(
                f"{p2}: {rel}"
            )
